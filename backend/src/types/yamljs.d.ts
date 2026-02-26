declare module 'yamljs' {
  interface YAML {
    load(path: string): any;
  }

  const YAML: YAML;
  export default YAML;
}

