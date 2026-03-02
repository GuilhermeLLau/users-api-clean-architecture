/**
 * @openapi
 * /refresh:
 *   post:
 *     tags:
 *       - RefreshToken
 *     summary: Refresh JWT access token using a valid refresh token
 *     security: []
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
 *                 description: Valid refresh token obtained on login
 *                 example: d4f5a6b7c8e9f0a1b2c3d4e5f6a7b8c9
 *     responses:
 *       200:
 *         description: New access token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: New JWT access token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   description: New refresh token
 *                   example: d4f5a6b7c8e9f0a1b2c3d4e5f6a7b8c9
 *       401:
 *         description: Refresh token invalid or expired
 *       404:
 *         description: Refresh token not found
 */

export {};
