/**
 * @openapi
 * /refresh:
 *   put:
 *     tags:
 *       - RefreshToken
 *     summary: Revoke a refresh token (invalidate without deleting)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token to revoke
 *                 example: d4f5a6b7c8e9f0a1b2c3d4e5f6a7b8c9
 *     responses:
 *       201:
 *         description: Refresh token revoked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token Revoked
 *       400:
 *         description: Invalid or missing refresh token
 *       401:
 *         description: Unauthorized - missing or invalid JWT token
 *       404:
 *         description: Refresh token not found
 */

export {};
