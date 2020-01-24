while (true) {

    if (currentX() > enemyX()) {
        move("left");
    } else if (currentX() < enemyX()) {
        move("right");
    } else {
        if (currentY() > enemyY()) {
            throwSnowball("up");
        } else {
            throwSnowball("down");
        }
    }

}