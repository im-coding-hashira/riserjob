
import React, { useState } from 'react';
import { Upload, FileCheck2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const CsvUploadTab: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!csvFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a CSV file to upload.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUploading(true);
    
    // CSV parsing function
    const parseCSV = (text: string): Array<Record<string, string>> => {
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(header => header.trim());
      const results = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',').map(value => value.trim());
        const entry: Record<string, string> = {};
        
        headers.forEach((header, index) => {
          entry[header] = values[index] || '';
        });
        
        results.push(entry);
      }
      
      return results;
    };
    
    try {
      const text = await csvFile.text();
      const parsedData = parseCSV(text);
      
      // Validate required fields
      const requiredFields = ['title', 'company', 'location', 'job_type'];
      const missingFields = [];
      
      for (const field of requiredFields) {
        if (!parsedData[0][field]) {
          missingFields.push(field);
        }
      }
      
      if (missingFields.length > 0) {
        toast({
          title: 'Invalid CSV format',
          description: `Missing required fields: ${missingFields.join(', ')}`,
          variant: 'destructive',
        });
        setIsUploading(false);
        return;
      }
      
      // Process the CSV data (mock implementation for now)
      // In a real implementation, we would insert this data into Supabase
      setTimeout(() => {
        toast({
          title: 'Upload successful',
          description: `${parsedData.length} job listings have been processed.`,
        });
        
        setIsUploading(false);
        setCsvFile(null);
      }, 1500);
    } catch (error) {
      console.error('Error processing CSV:', error);
      toast({
        title: 'Error processing CSV',
        description: 'There was an error processing the CSV file.',
        variant: 'destructive',
      });
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Upload CSV File</h2>
      <p className="text-muted-foreground mb-6">
        Upload a CSV file containing job listings. The file should include columns for title, company, location,
        description, salary, job type, and more.
      </p>
      
      <div className="space-y-6">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="csv-file">CSV File</Label>
          <Input 
            id="csv-file"
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
          />
        </div>
        
        <div>
          <Button
            onClick={handleUpload}
            disabled={!csvFile || isUploading}
            className="bg-riser-purple hover:bg-riser-secondary-purple"
          >
            {isUploading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload and Process
              </>
            )}
          </Button>
          {csvFile && (
            <p className="mt-2 text-sm text-muted-foreground">
              Selected file: {csvFile.name}
            </p>
          )}
        </div>
        
        <div className="mt-8 p-4 bg-green-50 text-green-800 rounded-md flex items-start">
          <FileCheck2 className="h-5 w-5 mr-3 mt-0.5" />
          <div>
            <p className="font-medium">CSV Format Requirements:</p>
            <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
              <li>Include headers: title, company, location, salary_min, salary_max, etc.</li>
              <li>Use UTF-8 encoding</li>
              <li>Max file size: 5MB</li>
              <li>Required fields: title, company, location, job_type</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CsvUploadTab;
