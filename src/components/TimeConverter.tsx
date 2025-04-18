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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const TimeConverter = () => {
  const [date, setDate] = useState<Date>();
  const [timeInput, setTimeInput] = useState("00:00:00");
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

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeInput(e.target.value);
  };

  const getFullDateTime = () => {
    if (!date) return "";
    const [hours, minutes, seconds] = timeInput.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours || 0);
    newDate.setMinutes(minutes || 0);
    newDate.setSeconds(seconds || 0);
    return newDate.toISOString();
  };

  const convertTime = () => {
    try {
      const fullDateTime = getFullDateTime();
      if (!fullDateTime) return "Please select date and time";
      const date = new Date(fullDateTime);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-black/20 border-purple-500/20 hover:bg-purple-500/20",
                    !date && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Time
            </label>
            <Input
              type="time"
              step="1"
              value={timeInput}
              onChange={handleTimeChange}
              className="w-full bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Source Time Zone
            </label>
            <Select value={sourceZone} onValueChange={setSourceZone}>
              <SelectTrigger className="bg-black/20 border-purple-500/20 text-gray-100">
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
              <SelectTrigger className="bg-black/20 border-purple-500/20 text-gray-100">
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
              className="bg-black/20 border-purple-500/20 text-gray-100"
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
