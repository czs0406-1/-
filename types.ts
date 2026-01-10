
export interface DrugAnalysis {
  status: 'success' | 'error';
  data?: {
    identity: {
      name_cn: string;
      personality_type: string;
      scientific_fact: string;
    };
    narrative: {
      monologue: string;
      quote: string;
      poem: string;
    };
    ui_design: {
      explanation: string;
      primary_color: string;
      background_color: string;
      accent_color: string;
    };
    interaction: {
      greeting: string;
    };
  };
  error_message?: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
