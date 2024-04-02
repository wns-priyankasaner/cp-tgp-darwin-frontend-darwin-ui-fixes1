export interface IEmailSentiments {
    category: string;
    emailSentimentbySubcat: ISubcategoryData[];
    negativeCount: number | null;
    negativePercentageByCategory: number;
    negativePercentageBySubcategory: number;
    neutralCount: number | null;
    neutralPercentageByCategory: number;
    neutralPercentageBySubcategory: number;
    positiveCount: number | null;
    positivePercentageByCategory: number;
    positivePercentageBySubcategory: number;
    subCategory: string | null;
    [key: string]: any;
  }
  
  export interface ISubcategoryData {
    subCategory: string;
    values: number[]; 
  }
  