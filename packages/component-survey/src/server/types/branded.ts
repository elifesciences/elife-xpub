// Taken from https://github.com/Microsoft/TypeScript/issues/202
//
function branded<T, Brand>() {
  return class Type {
    private value: Type
    private '__ kind': Brand
    static toBranded<Cls extends typeof Type>(this: Cls, t: T) {
      return (t as any) as InstanceType<Cls>
    }
    static fromBranded<Cls extends typeof Type>(
      this: Cls,
      b: InstanceType<Cls>,
    ) {
      return (b as any) as T
    }
    static Type: Type
  }
}

export class SurveyId extends branded<string, 'SurveyId'>() {}
