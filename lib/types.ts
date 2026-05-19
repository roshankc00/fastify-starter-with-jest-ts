;

export type FastifyDone = (error?: Error) => void;

export type ClerkPublicMetadata = {
  activeBusinessId?: string;
  onboardingComplete?: boolean;
};

type EmailTemplate = "Invitation";

export interface EmailPayload<T = any> {
  actionType: "Email";
  data: {
    template: EmailTemplate;
    toEmail: string;
    variables: T;
  };
}

export type Pagination = {
  page: number;
  limit: number;
};
