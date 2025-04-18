
import { useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Copy, CheckCircle2, RefreshCw, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TimeFormatter = () => {
  const [inputDate, setInputDate] = useState<string>("");
  const [formatString, setFormatString] = useState<string>("yyyy-MM-dd HH:mm:ss");
  const [formattedResult, setFormattedResult] = useState<string>("");
  const [weekInfo, setWeekInfo] = useState<{weekOfYear: string; weekOfMonth: string}>({weekOfYear: "", weekOfMonth: ""});
  const { toast } = useToast();
  
  const formatTemplates = [
    { label: "Standard Date", format: "yyyy-MM-dd" },
    { label: "Full Date & Time", format: "yyyy-MM-dd HH:mm:ss" },
    { label: "US Format", format: "MM/dd/yyyy" },
    { label: "EU Format", format: "dd.MM.yyyy" },
    { label: "Month Name", format: "MMMM d, yyyy" },
    { label: "Day of Week", format: "EEEE, MMMM d, yyyy" },
    { label: "Time Only", format: "HH:mm:ss" },
    { label: "12-Hour Time", format: "hh:mm a" },
  ];

  const formatDate = () => {
    try {
      const date = new Date(inputDate);
      
      if (isNaN(date.getTime())) {
        setFormattedResult("Invalid date");
        return;
      }
      
      const result = format(date, formatString);
      setFormattedResult(result);
      
      // Calculate week information
      const weekOfYear = format(date, "'Week' w 'of' yyyy");
      const weekOfMonth = getWeekOfMonth(date);
      setWeekInfo({
        weekOfYear,
        weekOfMonth: `Week ${weekOfMonth} of the month`,
      });
      
    } catch (error) {
      setFormattedResult("Error formatting date");
    }
  };

  // Function to get week of month
  const getWeekOfMonth = (date: Date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeekOnFirst = firstDayOfMonth.getDay();
    
    const day = date.getDate();
    const weekOfMonth = Math.ceil((day + dayOfWeekOnFirst) / 7);
    return weekOfMonth;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
  };

  const useCurrentTime = () => {
    const now = new Date();
    setInputDate(now.toISOString().slice(0, 16));
    formatDate();
  };

  const applyTemplate = (template: string) => {
    setFormatString(template);
    if (inputDate) {
      setTimeout(() => formatDate(), 0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-2">
        <FileText className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-800">Time Formatter</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Input Date
          </label>
          <div className="flex gap-2">
            <Input
              type="datetime-local"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={useCurrentTime} className="shrink-0">
              <RefreshCw className="h-4 w-4 mr-1" />
              Now
            </Button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Format Pattern
          </label>
          <Input
            value={formatString}
            onChange={(e) => setFormatString(e.target.value)}
            className="w-full font-mono text-sm"
            placeholder="yyyy-MM-dd HH:mm:ss"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {formatTemplates.slice(0, 6).map((template, idx) => (
            <Button 
              key={idx} 
              variant="outline" 
              size="sm"
              onClick={() => applyTemplate(template.format)}
              className="justify-start text-xs"
            >
              {template.label}
            </Button>
          ))}
        </div>
        
        <Button onClick={formatDate} className="w-full">
          Format Date
        </Button>
        
        {formattedResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500 mb-1">Formatted Result</div>
                <div className="text-lg font-medium">{formattedResult}</div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => copyToClipboard(formattedResult)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {weekInfo.weekOfYear && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-md flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-purple-600" />
              <div className="text-sm">{weekInfo.weekOfYear}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-md flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-purple-600" />
              <div className="text-sm">{weekInfo.weekOfMonth}</div>
            </div>
          </div>
        )}
        
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <CheckCircle2 className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-xs">
            Formatting options: yyyy (year), MM (month), dd (day), HH (hour 24h), 
            mm (minute), ss (second), h (hour 12h), a (am/pm), EEEE (day name), 
            MMMM (month name), w (week of year)
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default TimeFormatter;
