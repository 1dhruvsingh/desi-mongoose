export class DesiAggregation {
  private pipeline: any[] = [];

  milao(lookupConfig: any) {
    this.pipeline.push({ $lookup: lookupConfig });
    return this;
  }

  chuno(fields: string[]) {
    this.pipeline.push({ $project: fields.reduce((acc, field) => ({ ...acc, [field]: 1 }), {}) });
    return this;
  }

  samooh(groupConfig: any) {
    this.pipeline.push({ $group: groupConfig });
    return this;
  }

  khaaliChodo(skipCount: number) {
    this.pipeline.push({ $skip: skipCount });
    return this;
  }

  sirafDikhao(limitCount: number) {
    this.pipeline.push({ $limit: limitCount });
    return this;
  }

  kramBadlo(sortConfig: any) {
    this.pipeline.push({ $sort: sortConfig });
    return this;
  }

  milaKarGino(field: string) {
    this.pipeline.push({
      $group: {
        _id: null,
        total: { $sum: `$${field}` }
      }
    });
    return this;
  }

  unwind(field: string) {
    this.pipeline.push({ $unwind: `$${field}` });
    return this;
  }

  match(condition: any) {
    this.pipeline.push({ $match: condition });
    return this;
  }

  addFields(fields: any) {
    this.pipeline.push({ $addFields: fields });
    return this;
  }

  getPipeline() {
    return this.pipeline;
  }
}