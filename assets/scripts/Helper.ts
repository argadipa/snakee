import { v2, Vec2 } from "cc";

export function getEnumKeyByEnumValue<T extends {[index:string]:string}>(myEnum:T, enumValue:string):keyof T|null {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : null;
};

export function v2ToString (vector: Vec2){
    const {x, y} = vector;
    return `${x},${y}`;
}

export function stringToV2 (str: string) {
    const arr = str.split(',');
    return v2(parseInt(arr[0]), parseInt(arr[1]));
}
