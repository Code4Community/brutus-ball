while (true) {

    if (playerY() < enemyY()) {
        move("down")
    } else if (playerY() > enemyY()) {
        move("up")
    } else {
        if (playerX() > enemyX()) {
            throwFootball("left")
        } else {
            throwFootball("right")
        }
    }

}