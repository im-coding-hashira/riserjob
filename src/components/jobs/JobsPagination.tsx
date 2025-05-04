
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from '@/components/ui/button';

interface JobsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const JobsPagination: React.FC<JobsPaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  return (
    <div className="flex justify-center mt-8">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="outline"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
          </PaginationItem>
          
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i + 1}>
              <Button
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => onPageChange(i + 1)}
                className={
                  currentPage === i + 1
                    ? "bg-riser-purple hover:bg-riser-secondary-purple"
                    : ""
                }
              >
                {i + 1}
              </Button>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <Button
              variant="outline"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default JobsPagination;
