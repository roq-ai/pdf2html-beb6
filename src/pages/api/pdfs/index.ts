import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { pdfValidationSchema } from 'validationSchema/pdfs';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getPdfs();
    case 'POST':
      return createPdf();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPdfs() {
    const data = await prisma.pdf
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'pdf'));
    return res.status(200).json(data);
  }

  async function createPdf() {
    await pdfValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.html?.length > 0) {
      const create_html = body.html;
      body.html = {
        create: create_html,
      };
    } else {
      delete body.html;
    }
    const data = await prisma.pdf.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
