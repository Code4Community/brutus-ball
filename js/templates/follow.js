while (true) {

    if (playerX() > enemyX()) {
        move("left");
    } else if (playerX() < enemyX()) {
        move("right");
    } else {
        if (playerY() > enemyY()) {
            throwFootball("up");
        } else {
            throwFootball("down");
        }
    }

}