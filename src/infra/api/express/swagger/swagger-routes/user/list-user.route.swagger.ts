/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: List all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: clxj2k3l40000abc123xyz
 *                       name:
 *                         type: string
 *                         example: John Doe
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: john@example.com
 *                       passwordHash:
 *                         type: string
 *                         example: $2b$10$abcdefghijklmnopqrstuuVwxyz
 *                       role:
 *                         type: string
 *                         enum: [ADMIN, USER]
 *                         example: USER
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-01-01T00:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-06-01T00:00:00.000Z
 *       401:
 *         description: Unauthorized - missing or invalid JWT token
 */

export {};
