"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  User,
  Plus,
  MoreHorizontal,
  CalendarDays,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  client: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  caseNumber?: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
  icon: React.ReactNode;
}

const SortableTaskCard = ({ task, columnId }: { task: Task; columnId: string }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
    data: {
      type: "task",
      task,
      columnId,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="p-4 mb-3 cursor-move hover:shadow-md transition-shadow bg-white dark:bg-slate-800 border-l-4 border-l-indigo-500">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <User className="h-3 w-3" />
          <span>{task.client}</span>
          {task.caseNumber && (
            <>
              <span>•</span>
              <span>#{task.caseNumber}</span>
            </>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            <span>{task.dueDate}</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
      </Card>
    </div>
  );
};

const TaskCard = ({ task }: { task: Task }) => {
  const priorityColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  };

  return (
    <Card className="p-4 mb-3 bg-white dark:bg-slate-800 border-l-4 border-l-indigo-500">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {task.description}
      </p>
      
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <User className="h-3 w-3" />
        <span>{task.client}</span>
        {task.caseNumber && (
          <>
            <span>•</span>
            <span>#{task.caseNumber}</span>
          </>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="h-3 w-3" />
          <span>{task.dueDate}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
    </Card>
  );
};

interface AddTaskDialogProps {
  columnId: string;
  onAddTask: (columnId: string, task: Omit<Task, "id">) => void;
}

const AddTaskDialog = ({ columnId, onAddTask }: AddTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client: "",
    dueDate: "",
    priority: "medium" as Task["priority"],
    caseNumber: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.client && formData.dueDate) {
      onAddTask(columnId, formData);
      setFormData({
        title: "",
        description: "",
        client: "",
        dueDate: "",
        priority: "medium",
        caseNumber: "",
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Plus className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task for your legal workflow
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Review contract for Smith vs. Johnson"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add task details..."
              className="resize-none"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="Client name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="caseNumber">Case Number</Label>
              <Input
                id="caseNumber"
                value={formData.caseNumber}
                onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                placeholder="e.g., 2024-001"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Task["priority"]) => 
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function Kanban() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "To Do",
      color: "bg-slate-100 dark:bg-slate-800",
      icon: <Clock className="h-4 w-4" />,
      tasks: [
        {
          id: "1",
          title: "Review contract for Smith vs. Johnson",
          description: "Review and prepare amendments for the commercial lease agreement",
          client: "John Smith",
          dueDate: "Dec 28, 2024",
          priority: "high",
          caseNumber: "2024-001"
        },
        {
          id: "2",
          title: "Client meeting preparation",
          description: "Prepare documents and case summary for upcoming client meeting",
          client: "Sarah Williams",
          dueDate: "Dec 29, 2024",
          priority: "medium",
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "bg-blue-50 dark:bg-blue-900/20",
      icon: <AlertCircle className="h-4 w-4 text-blue-600" />,
      tasks: [
        {
          id: "3",
          title: "Draft motion for dismissal",
          description: "Complete the motion for dismissal in the Anderson case",
          client: "Robert Anderson",
          dueDate: "Dec 30, 2024",
          priority: "high",
          caseNumber: "2024-002"
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      color: "bg-yellow-50 dark:bg-yellow-900/20",
      icon: <Calendar className="h-4 w-4 text-yellow-600" />,
      tasks: [
        {
          id: "4",
          title: "Settlement agreement review",
          description: "Final review of settlement terms and conditions",
          client: "Martinez Corp",
          dueDate: "Dec 27, 2024",
          priority: "medium",
          caseNumber: "2024-003"
        },
      ],
    },
    {
      id: "completed",
      title: "Completed",
      color: "bg-green-50 dark:bg-green-900/20",
      icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
      tasks: [
        {
          id: "5",
          title: "File patent application",
          description: "Successfully filed patent application for Tech Innovations Inc.",
          client: "Tech Innovations Inc.",
          dueDate: "Dec 25, 2024",
          priority: "low",
          caseNumber: "2024-004"
        },
      ],
    },
  ]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { task } = active.data.current as { task: Task };
    
    setActiveId(active.id as string);
    setActiveTask(task);
  };

  const handleAddTask = (columnId: string, taskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      dueDate: new Date(taskData.dueDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
    };

    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: [...col.tasks, newTask],
        };
      }
      return col;
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setActiveTask(null);
      return;
    }

    const activeData = active.data.current as { columnId: string; task: Task };
    const overData = over.data.current as { columnId?: string };
    
    const activeColumnId = activeData.columnId;
    const overColumnId = overData?.columnId || over.id as string;
    
    if (activeColumnId === overColumnId) {
      // Reordering within the same column
      const column = columns.find(col => col.id === activeColumnId);
      if (!column) return;
      
      const oldIndex = column.tasks.findIndex(task => task.id === active.id);
      const newIndex = column.tasks.findIndex(task => task.id === over.id);
      
      if (oldIndex !== newIndex) {
        setColumns(columns.map(col => {
          if (col.id === activeColumnId) {
            return {
              ...col,
              tasks: arrayMove(col.tasks, oldIndex, newIndex),
            };
          }
          return col;
        }));
      }
    } else {
      // Moving to a different column
      const activeColumn = columns.find(col => col.id === activeColumnId);
      const overColumn = columns.find(col => col.id === overColumnId);
      
      if (!activeColumn || !overColumn) return;
      
      const activeTask = activeColumn.tasks.find(task => task.id === active.id);
      if (!activeTask) return;
      
      setColumns(columns.map(col => {
        if (col.id === activeColumnId) {
          return {
            ...col,
            tasks: col.tasks.filter(task => task.id !== active.id),
          };
        }
        if (col.id === overColumnId) {
          return {
            ...col,
            tasks: [...col.tasks, activeTask],
          };
        }
        return col;
      }));
    }
    
    setActiveId(null);
    setActiveTask(null);
  };

  return (
    <div className="h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Task Board</h2>
        <p className="text-muted-foreground">
          Manage your legal tasks and deadlines with our interactive Kanban board
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[calc(100vh-280px)]">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`${column.color} rounded-lg p-4 flex flex-col`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {column.icon}
                  <h3 className="font-semibold">{column.title}</h3>
                  <span className="text-sm text-muted-foreground bg-white/60 dark:bg-slate-900/60 px-2 py-0.5 rounded-full">
                    {column.tasks.length}
                  </span>
                </div>
                <AddTaskDialog 
                  columnId={column.id} 
                  onAddTask={handleAddTask} 
                />
              </div>
              
              <ScrollArea className="flex-1">
                <SortableContext
                  items={column.tasks.map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                  id={column.id}
                >
                  <div className="space-y-2" data-column-id={column.id}>
                    {column.tasks.map((task) => (
                      <SortableTaskCard
                        key={task.id}
                        task={task}
                        columnId={column.id}
                      />
                    ))}
                  </div>
                </SortableContext>
              </ScrollArea>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeId && activeTask ? (
            <TaskCard task={activeTask} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}