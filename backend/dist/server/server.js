import 'dotenv/config';
import app, { warmupApp } from './app.js';
const PORT = process.env.PORT || 5000;
async function start() {
    try {
        await warmupApp();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`API available at http://localhost:${PORT}/api`);
            console.log(`Vanilla HTML/CSS/JS client: http://localhost:${PORT}/vanilla/`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
start();
//# sourceMappingURL=server.js.map