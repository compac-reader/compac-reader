export interface Configuration {
  backColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  pagePaddingTop: number;
  pagePaddingBottom: number;
  pagePaddingLeft: number;
  pagePaddingRight: number;
}

export const DEFAULT_CONFIGURATION: Configuration = {
  backColor: '#fffff1',
  textColor: '#333333',
  fontSize: 18,
  fontFamily: 'serif',
  pagePaddingTop: 30,
  pagePaddingBottom: 30,
  pagePaddingLeft: 50,
  pagePaddingRight: 50
};
