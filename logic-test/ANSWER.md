Question 1: There are three light switches in the room where you are standing. In the adjacent room, three incandescent light bulbs are controlled by each of these switches. You are informed that all of the light bulbs in the other room are off, and all of the switches are originally down and in the off position.

How can you figure out which switches match which light bulbs if you are only given one chance to enter the room with them?

---

Answer:

Let's say I am in room A, where there are 3 switches:
Switch 1, Switch 2, Switch 3

In the adjacent room (room B), there are 3 incandescent light bulb:
Bulb 1, Bulb 2, Bulb 3

The way to determine the correct switch control:

1. Turn on Switch 1, leave it for a few minutes, then turn it off
2. Turn on Switch 2
3. Enter room B
4. Observe the following conditions:

- The bulb that is on → Switch 2
- The bulb that is off and warm/hot to the touch → Switch 1
- The bulb that is off and cool to the touch → Switch 3

---

---

Question 2: You are given two arrays of string “x”:

- first array: can hold at most 3 elements:
- second array: can hold at most 5 elements

Initially, both arrays are empty. You may perform the following operations:

- Fill an array to its maximum capacity (e.g., fill a second array with 5 items).
- Empty an array

- Move elements from one array to another until either:
  The source array is empty, or The destination array is full.

Write a series of operations to measure exactly 4 elements in the second array,
using only the operations above

---

Answer:

```typescript
let firstArray: string[] = []; // max length = 3
let secondArray: string[] = []; // max length = 5

// fill secondArray to its max capacity
secondArray.push('x', 'x', 'x', 'x', 'x');
// 1st array = 0, 2nd array = 5

// move elements from secondArray to firsArray until firstArray is full
firstArray.push(secondArray.pop()!);
firstArray.push(secondArray.pop()!);
firstArray.push(secondArray.pop()!);
// 1st array = 3, 2nd array = 2

// empty first array
firstArray = [];
// 1st array = 0, 2nd array = 2

// move remaining elements from secondArray to firstArray until secondArray empty
firstArray.push(secondArray.pop()!);
firstArray.push(secondArray.pop()!);
// 1st array = 2, 2nd array = 0

// fill secondArray to its max capacity again
secondArray.push('x', 'x', 'x', 'x', 'x');
// 1st array = 2, 2nd array = 5

// move one element from secondArray to firsArray until firstArray is full
firstArray.push(secondArray.pop()!);
// 1st array = 3, 2nd array = 4

console.log('result', secondArray);
```
