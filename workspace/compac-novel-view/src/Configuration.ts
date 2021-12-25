export interface Configuration {
  backColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  pagePaddingX: number;
  pagePaddingY: number;
}

export const DEFAULT_CONFIGURATION: Configuration = {
  backColor: '#fffff1',
  textColor: '#333333',
  fontSize: 18,
  fontFamily: 'serif',
  pagePaddingX: 50,
  pagePaddingY: 50
};
