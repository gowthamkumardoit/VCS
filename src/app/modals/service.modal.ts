export class Service {
  createby: number;
  createon: string;
  modifyby: number;
  modifyon: string;
  servicename: string;
  sid: number;
  statusser: number;
  task: Task[];
}

export class Task {
  duration: string;
  id: number;
  requiring: number;
  statustas: number;
  taskname: string;
}
