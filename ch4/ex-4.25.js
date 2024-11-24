/**
 const w = id(id(10));
 L-evaluate input:
 count;

 L-evaluate value
 1

 L-evaluate input
 w

 L-evaluate value
 2
 */

/**
 * id(10)은 평가가 지연된다. 따라서 첫 번째 count는 1이 된다.
 * 이후에 w가 평가될 때 id(10)이 평가되고, count는 2가 된다.
 */
