import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";

// 会议数据的接口定义
interface MeetingData {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  createdBy?: string;
  privacySettings?: {
    hideParticipantNames: boolean;
    hideParticipantLocations: boolean;
  };
  participants: Array<{
    id: string;
    name: string;
    locationId?: string; // 添加locationId字段
    location: string;
    timezone: string;
    localTime: string;
    confirmedAttendance?: boolean;
  }>;
}

// 存储活跃会议和其连接的客户端
const activeMeetings = new Map<string, {
  data: MeetingData;
  clients: Set<WebSocket>;
}>();

export async function registerRoutes(app: Express): Promise<Server> {
  // 设置Express中间件
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);
  
  // 创建WebSocket服务器实例，并设置路径为/ws
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // WebSocket连接处理
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    let meetingId: string | null = null;
    
    // 监听消息
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('WebSocket message received:', data.type);
        
        // 处理不同类型的消息
        switch (data.type) {
          case 'join':
            // 加入会议
            handleJoinMeeting(ws, data.meetingId);
            meetingId = data.meetingId;
            break;
            
          case 'update':
            // 更新会议数据
            if (data.meetingId && data.meeting) {
              handleUpdateMeeting(data.meetingId, data.meeting);
            }
            break;
            
          case 'leave':
            // 离开会议
            if (meetingId) {
              handleLeaveMeeting(ws, meetingId);
              meetingId = null;
            }
            break;
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    });
    
    // 处理连接关闭
    ws.on('close', () => {
      console.log('WebSocket connection closed');
      if (meetingId) {
        handleLeaveMeeting(ws, meetingId);
      }
    });
  });
  
  // 会议API路由
  // 获取会议信息
  app.get('/api/meetings/:id', (req: Request, res: Response) => {
    const meetingId = req.params.id;
    const meeting = activeMeetings.get(meetingId);
    
    if (meeting) {
      res.json({
        success: true,
        meeting: meeting.data
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }
  });
  
  // 创建新会议
  app.post('/api/meetings', (req: Request, res: Response) => {
    const meetingData: MeetingData = req.body.meeting;
    
    if (!meetingData || !meetingData.id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meeting data'
      });
    }
    
    // 设置默认隐私设置
    if (!meetingData.privacySettings) {
      meetingData.privacySettings = {
        hideParticipantNames: false,
        hideParticipantLocations: false
      };
    }
    
    // 将会议添加到活跃会议中
    activeMeetings.set(meetingData.id, {
      data: meetingData,
      clients: new Set()
    });
    
    res.json({
      success: true,
      meetingId: meetingData.id,
      shareUrl: `${req.protocol}://${req.get('host')}/meeting-planner?id=${meetingData.id}`
    });
  });
  
  // 更新会议隐私设置
  app.put('/api/meetings/:id/privacy', (req: Request, res: Response) => {
    const meetingId = req.params.id;
    const meeting = activeMeetings.get(meetingId);
    
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }
    
    const { hideParticipantNames, hideParticipantLocations } = req.body;
    
    // 更新隐私设置
    meeting.data.privacySettings = {
      hideParticipantNames: hideParticipantNames ?? meeting.data.privacySettings?.hideParticipantNames ?? false,
      hideParticipantLocations: hideParticipantLocations ?? meeting.data.privacySettings?.hideParticipantLocations ?? false
    };
    
    // 广播更新
    handleUpdateMeeting(meetingId, meeting.data);
    
    res.json({
      success: true,
      privacySettings: meeting.data.privacySettings
    });
  });
  
  // 更新参与者状态
  app.put('/api/meetings/:id/participants/:participantId', (req: Request, res: Response) => {
    const meetingId = req.params.id;
    const participantId = req.params.participantId;
    const meeting = activeMeetings.get(meetingId);
    
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }
    
    const { confirmedAttendance } = req.body;
    
    // 更新参与者状态
    const participant = meeting.data.participants.find(p => p.id === participantId);
    if (participant) {
      participant.confirmedAttendance = confirmedAttendance;
      
      // 广播更新
      handleUpdateMeeting(meetingId, meeting.data);
      
      res.json({
        success: true,
        participant
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }
  });

  return httpServer;
}

// WebSocket处理函数
function handleJoinMeeting(ws: WebSocket, meetingId: string) {
  const meeting = activeMeetings.get(meetingId);
  
  if (meeting) {
    // 添加客户端到会议
    meeting.clients.add(ws);
    
    // 发送会议数据给新客户端
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'meeting-data',
        meeting: meeting.data
      }));
    }
  } else {
    // 会议不存在
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Meeting not found'
      }));
    }
  }
}

function handleUpdateMeeting(meetingId: string, meetingData: MeetingData) {
  const meeting = activeMeetings.get(meetingId);
  
  if (meeting) {
    // 更新会议数据
    meeting.data = meetingData;
    
    // 广播更新给所有连接的客户端
    const message = JSON.stringify({
      type: 'meeting-update',
      meeting: meetingData
    });
    
    meeting.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

function handleLeaveMeeting(ws: WebSocket, meetingId: string) {
  const meeting = activeMeetings.get(meetingId);
  
  if (meeting) {
    // 从会议中移除客户端
    meeting.clients.delete(ws);
    
    // 如果没有客户端连接了，并且会议已经超过一定时间，可以考虑清理会议数据
    if (meeting.clients.size === 0) {
      // 这里可以设置一个延迟清理机制，比如30分钟后自动清理
      // 为了简单起见，这里保留会议数据而不清理
    }
  }
}
