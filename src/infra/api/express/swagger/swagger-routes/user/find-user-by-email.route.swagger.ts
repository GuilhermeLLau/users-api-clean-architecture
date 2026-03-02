/**
 * @openapi
 * /users/email/{email}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Find a user by email
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: The user email address
 *         example: john@example.com
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: clxj2k3l40000abc123xyz
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: john@example.com
 *                 role:
 *                   type: string
 *                   enum: [ADMIN, USER]
 *                   example: USER
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-01T00:00:00.000Z
 *       400:
 *         description: Invalid email
 *       401:
 *         description: Unauthorized - missing or invalid JWT token
 *       404:
 *         description: User not found
 */

export {};
