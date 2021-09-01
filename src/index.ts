import { sync } from 'glob';
import { normalize, extname } from 'path';
import { InMemoryQueueManager } from './im-memory-queue-manager';
import { MetadataArgsStorage } from './metadata-builder/metadata-args-storage';
import { Queues } from './queues';

export * from './container';
export * from './models';
export * from './queues';

export * from './decorators/class/in-memory-queue-controller';
export * from './decorators/method/listener';

function importClassesFromDirectories(
  directories: string[],
  formats: string[] = ['.js', '.ts'],
): Function[] {
  const loadClassFiles = (exported: any, allLoaded: Function[]) => {
    if (exported instanceof Function) {
      allLoaded.push(exported);
    } else if (exported instanceof Array) {
      exported.forEach((i: any) => loadClassFiles(i, allLoaded));
    } else if (exported instanceof Object || typeof exported === 'object') {
      Object.keys(exported).forEach((key) =>
        loadClassFiles(exported[key], allLoaded),
      );
    }

    return allLoaded;
  };

  const allFiles = directories.reduce<string[]>(
    (allDirs, dir) => allDirs.concat(sync(normalize(dir))),
    [],
  );

  const dirs = allFiles
    .filter((file) => {
      const dtsExtension = file.substring(file.length - 5, file.length);
      return formats.indexOf(extname(file)) !== -1 && dtsExtension !== '.d.ts';
    })
    .map((file) => {
      return require(file);
    });

  return loadClassFiles(dirs, []);
}

export function registerController(
  jobs: Function[] | string[],
  queues: Queues,
): void {
  if (jobs?.length) {
    const jobClasses: Function[] = (jobs as any[])
      .filter((controller) => controller instanceof Function)
      .concat(
        importClassesFromDirectories(
          (jobs as any[]).filter(
            (controller) => typeof controller === 'string',
          ),
        ),
      );

    InMemoryQueueManager.registerController(jobClasses, queues);
  }
}

export function getMetadataArgsStorage(): MetadataArgsStorage {
  if (!(global as any).inMemoryControllerMetadataArgsStorage) {
    (global as any).inMemoryControllerMetadataArgsStorage =
      new MetadataArgsStorage();
  }

  return (global as any).inMemoryControllerMetadataArgsStorage;
}
