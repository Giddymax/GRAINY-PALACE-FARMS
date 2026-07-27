import { requireStaff } from "@/lib/auth/require-role";
import { getCertifications } from "@/lib/data/misc";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CertificationFormDialog } from "@/components/admin/certification-form-dialog";
import { EntityDeleteButton } from "@/components/admin/entity-delete-button";
import { deleteCertificationAction } from "@/lib/actions/admin/certifications";

export const metadata = { title: "Certifications — Admin" };

export default async function AdminCertificationsPage() {
  await requireStaff();
  const certifications = await getCertifications();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold">Certifications</h1>
        <CertificationFormDialog />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Issuing body</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certifications.map((cert) => (
              <TableRow key={cert.id}>
                <TableCell className="font-medium">{cert.name}</TableCell>
                <TableCell className="text-muted-foreground">{cert.issuing_body ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={cert.status === "active" ? "default" : "outline"} className="capitalize">
                    {cert.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <CertificationFormDialog certification={cert} />
                    <EntityDeleteButton onDelete={() => deleteCertificationAction(cert.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {certifications.length === 0 && (
              <TableRow><TableCell colSpan={4} className="py-10 text-center text-muted-foreground">No certifications yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
