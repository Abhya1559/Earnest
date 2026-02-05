"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, Search, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Task {
  id: number;
  title: string;
  status: "pending" | "completed";
}

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);

  /* ================= FETCH TASKS ================= */
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await api.get("/tasks", {
        params: {
          page,
          limit: 6,
          search,
          status,
        },
      });

      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
    } catch {
      console.error("Failed to fetch tasks");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CREATE TASK ================= */
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await api.post("/tasks", { title });

      setTitle("");
      fetchTasks();
    } catch {
      console.error("Failed to add task");
    }
  };

  /* ================= TOGGLE ================= */
  const toggleTask = async (id: number) => {
    try {
      await api.patch(`/tasks/${id}/toggle`);
      fetchTasks();
    } catch {
      console.error("Failed to toggle");
    }
  };

  /* ================= DELETE ================= */
  const deleteTask = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch {
      console.error("Failed to delete");
    }
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchTasks();
  }, [search, status, page]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Tasks</h1>
            <p className="text-gray-400">Stay productive 🚀</p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

            <input
              placeholder="Search..."
              className="w-full bg-[#111] border border-white/10 pl-10 pr-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/40 outline-none"
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>

        {/* ================= FILTER + ADD ================= */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Filter */}
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="bg-[#111] border border-white/10 px-4 py-2 rounded-xl text-sm"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          {/* Add */}
          <form onSubmit={addTask} className="flex flex-1 gap-2">
            <input
              value={title}
              placeholder="Add new task..."
              className="flex-1 bg-[#111] border border-white/10 px-4 py-2 rounded-xl"
              onChange={(e) => setTitle(e.target.value)}
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 p-3 rounded-xl"
            >
              <Plus size={20} />
            </button>
          </form>
        </div>

        {/* ================= TASK LIST ================= */}
        <div className="grid gap-3">
          {loading ? (
            <p className="text-center text-gray-400 py-10">Loading...</p>
          ) : tasks.length ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between bg-[#111] border border-white/5 p-4 rounded-xl hover:border-white/20 transition"
              >
                {/* Left */}
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleTask(task.id)}>
                    {task.status === "completed" ? (
                      <CheckCircle2 className="text-blue-500 w-5 h-5" />
                    ) : (
                      <Circle className="text-gray-500 w-5 h-5" />
                    )}
                  </button>

                  <span
                    className={`text-sm ${
                      task.status === "completed"
                        ? "line-through text-gray-500"
                        : ""
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      task.status === "completed"
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {task.status}
                  </span>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-gray-500 bg-[#111] rounded-xl border border-dashed border-white/10">
              No tasks found
            </div>
          )}
        </div>

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 pt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-1 rounded bg-gray-800 disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-sm text-gray-400">
              {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-1 rounded bg-gray-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
