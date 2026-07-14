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

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
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
      });

      if (!response.ok) {
        throw new Error("タスクの追加に失敗しました");
      }

      setTitle("");
      setDescription("");
      setDeadline("");
      setEstimatedHours(1);
      setImportance(3);
      setError("");

      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">AI Task Manager</h1>

        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-4 rounded-lg bg-white p-6 shadow"
        >
          <h2 className="text-xl font-semibold">タスク追加</h2>

          <input
            className="w-full rounded border p-2"
            type="text"
            placeholder="タイトル"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <textarea
            className="w-full rounded border p-2"
            placeholder="説明"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <input
            className="w-full rounded border p-2"
            type="datetime-local"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
            required
          />

          <input
            className="w-full rounded border p-2"
            type="number"
            min="0"
            step="0.5"
            value={estimatedHours}
            onChange={(event) => setEstimatedHours(Number(event.target.value))}
            required
          />

          <select
            className="w-full rounded border p-2"
            value={importance}
            onChange={(event) => setImportance(Number(event.target.value))}
          >
            <option value={1}>重要度 1</option>
            <option value={2}>重要度 2</option>
            <option value={3}>重要度 3</option>
            <option value={4}>重要度 4</option>
            <option value={5}>重要度 5</option>
          </select>

          <button
            className="rounded bg-black px-4 py-2 text-white"
            type="submit"
          >
            追加
          </button>
        </form>

        {error && (
          <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>
        )}

        <section>
          <h2 className="mb-4 text-xl font-semibold">タスク一覧</h2>

          <div className="space-y-4">
            {tasks.map((task) => (
              <article key={task.id} className="rounded-lg bg-white p-5 shadow">
                <h3 className="text-lg font-bold">{task.title}</h3>

                <p className="mt-2 text-gray-600">
                  {task.description || "説明なし"}
                </p>

                <div className="mt-3 text-sm">
                  <p>
                    締切：
                    {new Date(task.deadline).toLocaleString("ja-JP")}
                  </p>
                  <p>重要度：{task.importance}</p>
                  <p>予想作業時間：{task.estimated_hours}時間</p>
                  <p className="font-bold">AI優先度：{task.ai_priority}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
