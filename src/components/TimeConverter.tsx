
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
import { Clock } from "lucide-react";
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
  ];

  const convertTime = () => {
    try {
      const date = new Date(inputTime);
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
      title: "已复制到剪贴板",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex items-center justify-center space-x-2">
          <Clock className="w-6 h-6 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">时间转换器</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              输入时间
            </label>
            <Input
              type="datetime-local"
              value={inputTime}
              onChange={(e) => setInputTime(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                源时区
              </label>
              <Select value={sourceZone} onValueChange={setSourceZone}>
                <SelectTrigger>
                  <SelectValue placeholder="选择源时区" />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                目标时区
              </label>
              <Select value={targetZone} onValueChange={setTargetZone}>
                <SelectTrigger>
                  <SelectValue placeholder="选择目标时区" />
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              转换结果
            </label>
            <div className="flex gap-2">
              <Input
                value={convertTime()}
                readOnly
                className="bg-gray-50"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="shrink-0"
              >
                复制
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeConverter;
