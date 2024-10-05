
export interface Evaluation {
    id: number;
    review_title: string;
    primary_video_link: string;
    video_link_two?: string;
    video_link_three?: string;
    video_description?: string;
    evaluation_status: string;
    payment_status: string;
    created_at: string;
  }
  
  export interface EvaluationsByStatus {
    Requested: Evaluation[];
    Accepted: Evaluation[];
    Completed: Evaluation[];
    Declined: Evaluation[];
  }
  