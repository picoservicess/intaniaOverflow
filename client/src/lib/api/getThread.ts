import { threads } from "./data";

export default function getThread(id: string) {
  return threads.find((thread) => thread.id === id);
}
