/** Global definitions for development **/

// for style loader
declare module "*.css" {
  const styles: any;
  export = styles;
}

type PartialPick<T, K extends keyof T> = Partial<T> & Pick<T, K>;
