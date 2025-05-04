
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Job, JobType, ExperienceLevel } from "@/lib/types";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  company: z.string().min(2, "Company must be at least 2 characters."),
  location: z.string().min(2, "Location is required."),
  job_type: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
  experience_level: z.enum(["Entry", "Mid", "Senior"]),
  description: z.string().min(10, "Description must be at least 10 characters."),
  salary_min: z.string().optional(),
  salary_max: z.string().optional(),
  remote: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface AddJobFormProps {
  onJobAdded: (job: Job) => void;
  onCancel: () => void;
  initialData?: Job;
  isEditing?: boolean;
}

const AddJobForm: React.FC<AddJobFormProps> = ({ 
  onJobAdded, 
  onCancel, 
  initialData,
  isEditing = false
}) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      company: initialData.company,
      location: initialData.location,
      job_type: initialData.job_type,
      experience_level: initialData.experience_level,
      description: initialData.description,
      salary_min: initialData.salary_min?.toString() || "",
      salary_max: initialData.salary_max?.toString() || "",
      remote: initialData.remote,
    } : {
      title: "",
      company: "",
      location: "",
      job_type: "Full-time",
      experience_level: "Mid",
      description: "",
      salary_min: "",
      salary_max: "",
      remote: false,
    },
  });

  const onSubmit = (values: FormValues) => {
    // Create or update job object
    const jobData: Job = {
      id: initialData?.id || uuidv4(),
      title: values.title,
      company: values.company,
      location: values.location,
      job_type: values.job_type as JobType,
      experience_level: values.experience_level as ExperienceLevel,
      description: values.description,
      salary_min: values.salary_min ? parseInt(values.salary_min) : undefined,
      salary_max: values.salary_max ? parseInt(values.salary_max) : undefined,
      remote: values.remote,
      posted_at: initialData?.posted_at || new Date().toISOString(),
      source: initialData?.source || "admin",
    };

    onJobAdded(jobData);
    
    toast({
      title: isEditing ? "Job updated" : "Job added",
      description: isEditing 
        ? "The job listing has been successfully updated."
        : "The job listing has been successfully added.",
    });
  };

  return (
    <div className="bg-white rounded-lg">
      <h2 className="text-xl font-bold mb-6">{isEditing ? 'Edit Job' : 'Add New Job'}</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Frontend Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., San Francisco, CA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="job_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="experience_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Entry">Entry</SelectItem>
                      <SelectItem value="Mid">Mid</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="salary_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Salary</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="salary_max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Salary</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 80000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter the job description..." 
                    className="min-h-32"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="remote"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Remote Position</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? 'Update Job' : 'Add Job'}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddJobForm;
