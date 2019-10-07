export default class Plan {
  constructor(
    operations,
    id,
    args,
    results,
    states,
    name,
    tags,
    description,
    isBuilt
  ) {
    this.operations = operations;
    this.id = id;
    this.args = args;
    this.results = results;
    this.states = states;
    this.name = name;
    this.tags = tags;
    this.description = description;
    this.isBuilt = isBuilt;
  }
}
