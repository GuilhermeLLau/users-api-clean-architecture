/**
 * @openapi
 * /reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset user password using a valid reset token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 description: Password reset token received by email
 *                 example: d4f5a6b7c8e9f0a1b2c3d4e5f6a7b8c9
 *               password:
 *                 type: string
 *                 format: password
 *                 description: New password to set
 *                 example: newSecret123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated
 *       400:
 *         description: Validation error or invalid token
 *       401:
 *         description: Token expired or already used
 *       404:
 *         description: User not found
 */

export {};
