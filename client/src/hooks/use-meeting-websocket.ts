import { useState, useEffect, useCallback, useRef } from 'react';

// 定义消息类型
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

interface WebSocketMessage {
  type: string;
  meeting?: MeetingData;
  meetingId?: string;
  message?: string;
}

// WebSocket钩子
export function useMeetingWebSocket(meetingId?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // 建立WebSocket连接
  useEffect(() => {
    if (!meetingId) return;

    // 创建WebSocket连接
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    // 连接建立时
    socket.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
      setError(null);
      
      // 加入会议
      socket.send(JSON.stringify({
        type: 'join',
        meetingId
      }));
    };

    // 接收消息
    socket.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        console.log('WebSocket message received:', data.type);
        
        switch (data.type) {
          case 'meeting-data':
          case 'meeting-update':
            if (data.meeting) {
              setMeetingData(data.meeting);
            }
            break;
            
          case 'error':
            setError(data.message || 'Unknown error');
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message', error);
      }
    };

    // 连接关闭
    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
    };

    // 连接错误
    socket.onerror = (err) => {
      console.error('WebSocket error', err);
      setError('WebSocket connection error');
      setIsConnected(false);
    };

    // 清理函数
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        // 离开会议
        socket.send(JSON.stringify({
          type: 'leave',
          meetingId
        }));
        socket.close();
      }
    };
  }, [meetingId]);

  // 发送会议更新
  const updateMeeting = useCallback((updatedMeeting: MeetingData) => {
    if (!isConnected || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setError('WebSocket not connected');
      return false;
    }

    try {
      socketRef.current.send(JSON.stringify({
        type: 'update',
        meetingId: updatedMeeting.id,
        meeting: updatedMeeting
      }));
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message', error);
      setError('Failed to send update');
      return false;
    }
  }, [isConnected]);

  // 更新隐私设置
  const updatePrivacySettings = useCallback((hideParticipantNames: boolean, hideParticipantLocations: boolean) => {
    if (!meetingData) return false;
    
    const updatedMeeting = {
      ...meetingData,
      privacySettings: {
        hideParticipantNames,
        hideParticipantLocations
      }
    };
    
    return updateMeeting(updatedMeeting);
  }, [meetingData, updateMeeting]);

  // 更新参与者确认状态
  const updateParticipantStatus = useCallback((participantId: string, confirmedAttendance: boolean) => {
    if (!meetingData) return false;
    
    const updatedMeeting = {
      ...meetingData,
      participants: meetingData.participants.map(p => 
        p.id === participantId 
          ? { ...p, confirmedAttendance } 
          : p
      )
    };
    
    return updateMeeting(updatedMeeting);
  }, [meetingData, updateMeeting]);

  return {
    isConnected,
    meetingData,
    error,
    updateMeeting,
    updatePrivacySettings,
    updateParticipantStatus
  };
}