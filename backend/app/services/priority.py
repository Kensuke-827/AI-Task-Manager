from datetime import datetime


def calculate_priority(task):
    score = 0

    # 重要度
    score += task.importance * 10

    # 締切
    days_left = (task.deadline - datetime.now()).days

    if days_left <= 1:
        score += 40
    elif days_left <= 3:
        score += 25
    elif days_left <= 7:
        score += 10

    # 作業時間
    if task.estimated_hours >= 5:
        score += 10

    return score