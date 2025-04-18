import { useState, useEffect } from "react";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Button } from "@/components/ui/button";
import { Copy, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CurrentTime = () => {
  const [now, setNow] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState("UTC");
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

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
  };

  const formatTypes = [
    {
      label: "Unix Timestamp (seconds)",
      value: Math.floor(now.getTime() / 1000).toString(),
    },
    {
      label: "Unix Timestamp (milliseconds)",
      value: now.getTime().toString(),
    },
    {
      label: "ISO 8601",
      value: now.toISOString(),
    },
    {
      label: "Local Format",
      value: formatInTimeZone(now, selectedTimezone, "yyyy-MM-dd HH:mm:ss"),
    },
    {
      label: "UTC Format",
      value: format(now, "yyyy-MM-dd HH:mm:ss 'UTC'"),
    },
    {
      label: "Date Only",
      value: formatInTimeZone(now, selectedTimezone, "yyyy-MM-dd"),
    },
    {
      label: "Time Only",
      value: formatInTimeZone(now, selectedTimezone, "HH:mm:ss"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-2">
        <Clock className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Current Time</h2>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl font-bold text-white">
          {formatInTimeZone(now, selectedTimezone, "HH:mm:ss")}
        </div>
        <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
          <SelectTrigger className="w-[180px] bg-black/20 border-purple-500/20 text-gray-100">
            <SelectValue placeholder="Time Zone" />
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

      <div className="grid gap-4">
        {formatTypes.map((type, index) => (
          <Card key={index} className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-300">{type.label}</div>
                <div className="font-mono text-sm break-all text-gray-100">{type.value}</div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => copyToClipboard(type.value)}
                className="text-gray-300 hover:text-white"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CurrentTime;
