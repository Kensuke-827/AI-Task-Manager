"use client";

import { FormEvent, useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string | null;
  deadline: string;
  estimated_hours: number;
  importance: number;
  ai_priority: number;
  completed: boolean;
};

const API_URL = "https://ai-task-manager-api-7eck.onrender.com/tasks/";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [estimatedHours, setEstimatedHours] = useState(1);
  const [importance, setImportance] = useState(3);
  const [error, setError] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("タスク一覧の取得に失敗しました");
      }

      const data: Task[] = await response.json();
      setTasks(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    }
  };
  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("タスクの削除に失敗しました");
      }

      await fetchTasks();
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);
  const parseDeadline = (value: string) => {
    // タイムゾーン情報がなければ、DBに保存されたUTC日時として扱う
    const hasTimezone = value.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(value);

    return new Date(hasTimezone ? value : `${value}Z`);
  };

  const formatDeadline = (value: string) => {
    return parseDeadline(value).toLocaleString("ja-JP");
  };

  const formatDeadlineForInput = (value: string) => {
    const date = parseDeadline(value);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  const getPriorityStyle = (priority: number) => {
    if (priority >= 80) {
      return "bg-red-100 text-red-700";
    }

    if (priority >= 50) {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";
  };
  const startEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description ?? "");
    setDeadline(formatDeadlineForInput(task.deadline));
    setEstimatedHours(task.estimated_hours);
    setImportance(task.importance);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setError("");

      const isEditing = editingTaskId !== null;

      const response = await fetch(
        isEditing ? `${API_URL}${editingTaskId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            deadline: new Date(deadline).toISOString(),
            estimated_hours: estimatedHours,
            importance,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          isEditing
            ? "タスクの更新に失敗しました"
            : "タスクの追加に失敗しました",
        );
      }

      await fetchTasks();

      setTitle("");
      setDescription("");
      setDeadline("");
      setEstimatedHours(1);
      setImportance(3);
      setEditingTaskId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">AI Task Manager</h1>

        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-4 rounded-lg bg-white p-6 shadow"
        >
          <h2 className="text-xl font-semibold">
            {editingTaskId !== null ? "タスク編集" : "タスク追加"}
          </h2>

          <div>
            <label className="mb-1 block font-medium">タイトル</label>
            <input
              className="w-full rounded border p-2"
              type="text"
              placeholder="例：レポート課題"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">説明</label>
            <textarea
              className="w-full rounded border p-2"
              placeholder="タスクの内容を入力してください"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">締切</label>
            <input
              className="w-full rounded border p-2"
              type="datetime-local"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">予想作業時間</label>

            <p className="mb-2 text-sm text-gray-500">
              このタスクを完了するまでに必要だと思う時間を入力してください。
              （例：30分なら0.5、2時間なら2）
            </p>

            <div className="flex items-center gap-2">
              <input
                className="w-full rounded border p-2"
                type="number"
                min="0"
                step="0.5"
                value={estimatedHours}
                onChange={(event) =>
                  setEstimatedHours(Number(event.target.value))
                }
                required
              />
              <span className="whitespace-nowrap">時間</span>
            </div>
          </div>

          <div>
            <label className="mb-1 block font-medium">重要度</label>

            <p className="mb-2 text-sm text-gray-500">
              タスクの重要さを選択してください。
            </p>

            <select
              className="w-full rounded border p-2"
              value={importance}
              onChange={(event) => setImportance(Number(event.target.value))}
            >
              <option value={1}>1：低い（後回しでも問題ない）</option>
              <option value={2}>2：やや低い</option>
              <option value={3}>3：普通</option>
              <option value={4}>4：高い（早めに終わらせたい）</option>
              <option value={5}>5：非常に高い（最優先）</option>
            </select>
          </div>

          <button
            className="rounded bg-black px-4 py-2 text-white"
            type="submit"
          >
            {editingTaskId !== null ? "更新する" : "追加する"}
          </button>
          {editingTaskId !== null && (
            <button
              type="button"
              className="ml-2 rounded bg-gray-300 px-4 py-2 text-gray-800"
              onClick={() => {
                setEditingTaskId(null);
                setTitle("");
                setDescription("");
                setDeadline("");
                setEstimatedHours(1);
                setImportance(3);
              }}
            >
              キャンセル
            </button>
          )}
        </form>

        {error && (
          <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>
        )}

        <section>
          <h2 className="mb-4 text-xl font-semibold">タスク一覧</h2>
          <div className="space-y-4">
            {tasks.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
                まだタスクがありません。上のフォームから追加してください。
              </div>
            )}

            {[...tasks]
              .sort((a, b) => b.ai_priority - a.ai_priority)
              .map((task) => (
                <article
                  key={task.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {task.title}
                    </h3>

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${getPriorityStyle(
                        task.ai_priority,
                      )}`}
                    >
                      AI優先度：{task.ai_priority}
                    </span>
                  </div>

                  <p className="mt-3 text-gray-600">
                    {task.description || "説明なし"}
                  </p>

                  <div className="mt-4 grid gap-2 text-sm text-gray-700 sm:grid-cols-3">
                    <p>
                      <span className="font-medium">締切：</span>
                      {formatDeadline(task.deadline)}
                    </p>

                    <p>
                      <span className="font-medium">重要度：</span>
                      {task.importance}
                    </p>

                    <p>
                      <span className="font-medium">予想時間：</span>
                      {task.estimated_hours}時間
                    </p>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(task)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      編集
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const confirmed = window.confirm(
                          `「${task.title}」を削除しますか？`,
                        );

                        if (confirmed) {
                          deleteTask(task.id);
                        }
                      }}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      削除
                    </button>
                  </div>
                </article>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}
