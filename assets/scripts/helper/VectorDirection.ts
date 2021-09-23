import { math, v2, Vec2 } from "cc";

export class Vec2Helper {
  public static RIGHT = Object.freeze(new Vec2(1, 0));
  public static LEFT = Object.freeze(new Vec2(-1, 0));
  public static UP = Object.freeze(new Vec2(0, -1));
  public static DOWN = Object.freeze(new Vec2(0, 1));

  public static VecToAngle (pos: Vec2) {
    if (pos.equals(this.UP)) {
      return 0;
    } else if (pos.equals(this.LEFT)) {
      return -90;
    } else if (pos.equals(this.DOWN)) {
      return -180;
    } else if (pos.equals(this.RIGHT)) {
      return -270;
    }
  }
}
