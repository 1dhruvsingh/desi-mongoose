export class DesiQuery {
  private query: any = {};
  private options: any = {};

  jahaPe(field: string, value: any) {
    this.query[field] = value;
    return this;
  }

  badalKe(field: string, value: any) {
    this.query[field] = { $regex: value, $options: 'i' };
    return this;
  }

  baraabarNahi(field: string, value: any) {
    this.query[field] = { $ne: value };
    return this;
  }

  zyada(field: string, value: number) {
    this.query[field] = { $gt: value };
    return this;
  }

  kam(field: string, value: number) {
    this.query[field] = { $lt: value };
    return this;
  }

  zyadaYaBarabar(field: string, value: number) {
    this.query[field] = { $gte: value };
    return this;
  }

  kamYaBarabar(field: string, value: number) {
    this.query[field] = { $lte: value };
    return this;
  }

  inMeinHai(field: string, values: any[]) {
    this.query[field] = { $in: values };
    return this;
  }

  inMeinNahiHai(field: string, values: any[]) {
    this.query[field] = { $nin: values };
    return this;
  }

  exists(field: string, exists: boolean = true) {
    this.query[field] = { $exists: exists };
    return this;
  }

  sortKaro(field: string, order: 'asc' | 'desc' = 'asc') {
    this.options.sort = { [field]: order === 'asc' ? 1 : -1 };
    return this;
  }

  limitKaro(limit: number) {
    this.options.limit = limit;
    return this;
  }

  skipKaro(skip: number) {
    this.options.skip = skip;
    return this;
  }

  pageMeinDikhao(page: number, perPage: number = 10) {
    this.options.skip = (page - 1) * perPage;
    this.options.limit = perPage;
    return this;
  }

  getQuery() {
    return this.query;
  }

  getOptions() {
    return this.options;
  }
}