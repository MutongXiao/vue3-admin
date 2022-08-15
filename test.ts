type Person = {
	name: string;
	age: number;
};

const person: Person = {
	name: "张三",
	age: 18
};

type GetObjType1<T> = keyof T; // 就是取 T 的 key 做联合类型
type Type1 = GetObjType1<Person>; // type Type1 => keyof Person => "name" | "age"
const obj1: Type1 = "name";
console.log(obj1);

//-------------分割线--------------->
type PersonType = typeof person;
//=> type PersonType = {
// 	   name: string;
// 	   age: number;
//   }
const p: PersonType = {
	name: "李四",
	age: 20
};
console.log(p);

//-------------分割线--------------->
type GetObjType2<T> = {
	[key in keyof T]: T[key];
}; /// 等同于  typeof person;
type Type2 = GetObjType2<Person>;
//=> type Type2 = {
// 	   name: string;
// 	   age: number;
//   }
const obj2: Type2 = {
	name: "李四",
	age: 20
};
console.log(obj2);

//-------------分割线--------------->
type GetObjType3<T> = {
	[key in keyof T]: T[key];
}[keyof T]; // 取 T 的 ”key的类型“ 做联合类型
type Type3 = GetObjType3<Person>; // type Type2 = string | number
const obj3: Type3 = 18;
console.log(obj3);
