/**
 * halts를 작성할 수 있다고 가정한다.
 * strange는 정지한다면, 무한 루프에 빠진다. 정지하지 않는다면 "halts"를 반환한다.
 * strange(strange)를 평가할 때
 * halts가 참을 반환한다고 가정하면, 즉 strange(strange)가 정지한다고 가정하면 strange(strange)는 무한 루프에 빠진다.
 * halts가 거짓을 반환한다고 가정하면, 즉 strange(strange)가 정지하지 않는다고 가정하면 strange(strange)는 halted를 반환하고 종료한다.
 * halts가 어떠한 경우에도 성립하지 않으므로 논리적으로 모순이다.
 */
