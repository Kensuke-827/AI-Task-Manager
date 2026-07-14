from datetime import datetime, timezone


def calculate_priority(task):
    score = 0

    score += task.importance * 10

    now = datetime.now(timezone.utc)
    deadline = task.deadline

    if deadline.tzinfo is None:
        deadline = deadline.replace(tzinfo=timezone.utc)

    days_left = (deadline - now).days

    if days_left <= 1:
        score += 40
    elif days_left <= 3:
        score += 25
    elif days_left <= 7:
        score += 10

    if task.estimated_hours >= 5:
        score += 10

    return score