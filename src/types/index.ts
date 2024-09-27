export type Icon = {
  id: string;
  name: string;
  svg: string;
  color: string;
};

export type FormValues = {
  id: string;
  name: string;
  svg: File | null;
  color: string;
};
