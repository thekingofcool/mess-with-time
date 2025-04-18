
import { useState, useEffect } from "react";
import { format, fromUnixTime } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Copy, RefreshCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectTrigger, 
  SelectItem, 
  SelectValue 
} from "@/components/ui/select";

const TimestampConverter = () => {
  const [timestamp, setTimestamp] = useState<string>("");
  const [datetime, setDatetime] = useState<string>("");
  const [timestampType, setTimestampType] = useState<string>("seconds");
  const { toast } = useToast();

  // Update human-readable time when timestamp changes
  useEffect(() => {
    if (timestamp) {
      try {
        const ts = parseInt(timestamp);
        if (!isNaN(ts)) {
          // Convert to seconds if in milliseconds
          const tsInSeconds = timestampType === "milliseconds" ? ts / 1000 : ts;
          const date = fromUnixTime(tsInSeconds);
          setDatetime(format(date, "yyyy-MM-dd'T'HH:mm"));
        }
      } catch (error) {
        // Handle parsing errors
      }
    }
  }, [timestamp, timestampType]);

  // Update timestamp when datetime changes
  useEffect(() => {
    if (datetime) {
      try {
        const date = new Date(datetime);
        if (!isNaN(date.getTime())) {
          const ts = Math.floor(date.getTime() / 1000);
          setTimestamp(timestampType === "milliseconds" ? String(ts * 1000) : String(ts));
        }
      } catch (error) {
        // Handle parsing errors
      }
    }
  }, [datetime, timestampType]);

  const getCurrentTimestamp = () => {
    const now = new Date();
    if (timestampType === "milliseconds") {
      setTimestamp(String(now.getTime()));
    } else if (timestampType === "seconds") {
      setTimestamp(String(Math.floor(now.getTime() / 1000)));
    } else if (timestampType === "iso8601") {
      setTimestamp(now.toISOString());
    }
    setDatetime(format(now, "yyyy-MM-dd'T'HH:mm"));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-2">
        <ArrowUpDown className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-800">Timestamp Converter</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Select value={timestampType} onValueChange={setTimestampType}>
            <SelectTrigger className="w-40 bg-black/20 border-purple-500/20 text-gray-100">
              <SelectValue placeholder="Timestamp type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seconds">Unix (seconds)</SelectItem>
              <SelectItem value="milliseconds">Milliseconds</SelectItem>
              <SelectItem value="iso8601">ISO 8601</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={getCurrentTimestamp} 
            size="sm" 
            className="bg-black/20 border-purple-500/20 hover:bg-purple-500/20 text-gray-100"
          >
            <RefreshCcw className="h-4 w-4 mr-1" /> Current
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Timestamp
          </label>
          <div className="flex gap-2">
            <Input
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder={timestampType === "iso8601" ? "YYYY-MM-DDTHH:MM:SSZ" : "Enter timestamp"}
              className="flex-1 bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(timestamp)}
              className="shrink-0 bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
            >
              <Copy className="h-4 w-4 text-gray-300" />
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Human Readable Time
          </label>
          <div className="flex gap-2">
            <Input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="flex-1 bg-black/20 border-purple-500/20 text-gray-100 focus:border-purple-500"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(datetime)}
              className="shrink-0 bg-black/20 border-purple-500/20 hover:bg-purple-500/20"
            >
              <Copy className="h-4 w-4 text-gray-300" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimestampConverter;
