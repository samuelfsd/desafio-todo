'use client'

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getSession } from "next-auth/react";

export default function Todos() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<any>([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
  });

  const { toast } = useToast();

  const handleInputChange = (e) => {
    setNewTodo({
      ...newTodo,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTodo = async () => {
    if (newTodo.title.trim() !== "" && newTodo.description.trim() !== "") {
      try {
        const response = await fetch(`http://localhost:3333/todos/${user.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(newTodo),
        });

        if (response.ok) {
          const addedTodo = await response.json();
          setTodos([...todos, addedTodo]);
          setNewTodo({
            title: "",
            description: "",
          });
          toast({
            title: 'Todo adicionado com sucesso!',
          });
        } else {
          toast({
            variant: "destructive",
            title: 'Erro ao adicionar todo',
          });
        }
      } catch (err) {
        toast({
          variant: "destructive",
          title: 'Erro ao adicionar todo',
        });
      }
    }
  };

  const handleDeleteTodo = async (id) => {
    const response = await fetch(`http://localhost:3333/todos/${user.id}/${id}` , {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
    });

    if (response.ok) {
      setTodos(todos.filter((todo) => todo.id !== id));
      toast({
        title: 'Foi removido um TODO',
      });
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        console.log('Session user:', session);
        setUser(session);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchTodos = async () => {
      if (!user.token) return; // Aguarde até que o token esteja disponível

      try {
        const response = await fetch(`http://localhost:3333/todos/${user.id}` , {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
        });

        const data = await response.json();
        console.log('data', data);
        setTodos(data);
      } catch (err) {
        toast({
          variant: "destructive",
          title: 'Erro ao buscar todos',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [user, toast]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/2 bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-xl">Crie tarefas.</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titulo</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Informe um titulo..."
                value={newTodo.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Informe uma descrição..."
                value={newTodo.description}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleAddTodo}>Adicionar tarefa</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="w-full md:w-1/2 bg-background p-4 space-y-2">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todos.length === 0 && (
              <p>Não tem todos cadastrados!</p>
            )}
            {todos.map((todo: any) => (
              <Card key={todo.id} className="max-w-md w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{todo.title}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteTodo(todo.id)}>
                    <Trash2Icon className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="word">{todo.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Trash2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}
