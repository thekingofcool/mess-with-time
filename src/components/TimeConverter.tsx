import { useState } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const TimeConverter = () => {
  const [inputTime, setInputTime] = useState<string>("");
  const [sourceZone, setSourceZone] = useState("UTC");
  const [targetZone, setTargetZone] = useState("Asia/Shanghai");
  const { toast } = useToast();

  const timeZones = [
    "UTC",
    "Asia/Shanghai",
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
    "Australia/Sydney",
    "Europe/Paris",
    "America/Los_Angeles",
    "Pacific/Auckland",
    "Asia/Dubai",
    "Asia/Singapore",
    "America/Chicago",
    "Europe/Berlin",
    "Asia/Kolkata",
    "Europe/Moscow",
    "America/Sao_Paulo",
    "Africa/Cairo",
  ];

  const convertTime = () => {
    try {
      const date = new Date(inputTime);
      if (isNaN(date.getTime())) {
        return "Invalid time format";
      }
      const result = formatInTimeZone(date, targetZone, "yyyy-MM-dd HH:mm:ss zzz");
      return result;
    } catch (error) {
      return "Invalid time format";
    }
  };

  const copyToClipboard = () => {
    const result = convertTime();
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Input Time
          </label>
          <Input
            type="datetime-local"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
            className="w-full bg-black/20 border-purple-500/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Source Time Zone
            </label>
            <Select value={sourceZone} onValueChange={setSourceZone}>
              <SelectTrigger className="bg-black/20 border-purple-500/20">
                <SelectValue placeholder="Select source zone" />
              </SelectTrigger>
              <SelectContent>
                {timeZones.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Target Time Zone
            </label>
            <Select value={targetZone} onValueChange={setTargetZone}>
              <SelectTrigger className="bg-black/20 border-purple-500/20">
                <SelectValue placeholder="Select target zone" />
              </SelectTrigger>
              <SelectContent>
                {timeZones.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Converted Result
          </label>
          <div className="flex gap-2">
            <Input
              value={convertTime()}
              readOnly
              className="bg-black/20 border-purple-500/20"
            />
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="shrink-0 border-purple-500/20 hover:bg-purple-500/20"
            >
              Copy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeConverter;
