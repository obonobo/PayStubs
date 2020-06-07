// Contains some callbacks that I would apply to the node process

/**
 * To be run before PayStubs has shutdown
 * @param proc The node process that you want to hook
 * @param mong A mongoose import
 */
export function hookShutdown(proc: NodeJS.Process, mong: any ) {   

    // Disconnect the database when you shutdown
    proc.on('exit', () => {
        mong.disconnect();
    });
}
