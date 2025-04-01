import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff } from "lucide-react";

interface MeetingPrivacySettingsProps {
  hideParticipantNames: boolean;
  hideParticipantLocations: boolean;
  onSave: (hideNames: boolean, hideLocations: boolean) => void;
}

export default function MeetingPrivacySettings({
  hideParticipantNames,
  hideParticipantLocations,
  onSave
}: MeetingPrivacySettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hideNames, setHideNames] = useState(hideParticipantNames);
  const [hideLocations, setHideLocations] = useState(hideParticipantLocations);

  // Reset to current settings
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setHideNames(hideParticipantNames);
      setHideLocations(hideParticipantLocations);
    }
  };

  // Save settings
  const handleSave = () => {
    onSave(hideNames, hideLocations);
    setIsOpen(false);
  };
  
  // A comment to ensure the change is applied

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 text-sm"
        >
          <Shield className="h-4 w-4" />
          <span>Privacy Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Meeting Privacy Settings</DialogTitle>
          <DialogDescription>
            Control what information is visible to people who have the meeting link. These settings only affect information visibility on shared links.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="hide-names">Hide Participant Names</Label>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                {hideNames ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                <span>{hideNames ? "Participants will be shown as 'Participant #1, Participant #2...'" : "Show all participants' real names"}</span>
              </div>
            </div>
            <Switch
              id="hide-names"
              checked={hideNames}
              onCheckedChange={setHideNames}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="hide-locations">Hide Specific Locations</Label>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                {hideLocations ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                <span>{hideLocations ? "Only show time zones without specific cities/countries" : "Show participants' complete location information"}</span>
              </div>
            </div>
            <Switch
              id="hide-locations"
              checked={hideLocations}
              onCheckedChange={setHideLocations}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}