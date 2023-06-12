import { ref } from "vue";
import type { Ref } from "vue";

export default function useIdleQueue<T>(handler: (data: T) => void) {
  const queue = ref([]) as Ref<T[]>;

  function worker() {
    const data = queue.value.pop();
    if (data) handler(data);

    if (queue.value.length) {
      requestIdleCallback(worker);
    }
  }

  function push(data: T) {
    if (contains(data)) return;
    queue.value.push(data);
    if (queue.value.length === 1) {
      requestIdleCallback(worker);
    }
  }

  function contains(search: T) {
    return queue.value.some((data) => {
      if (Array.isArray(search) && Array.isArray(data)) {
        return (
          search.length === data.length &&
          search.every((item, i) => data[i] === item)
        );
      }

      throw new Error('Not implemented');
    });
  }

  return { push, contains };
}
