import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Users, Package, AlertTriangle, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, products: 0, pending: 0, reports: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roles } = await (supabase as any).from("user_roles").select("role").eq("user_id", session.user.id);
      const hasAdminRole = roles?.some((r: any) => r.role === "admin");

      if (!hasAdminRole) {
        toast({ title: "Access Denied", description: "You don't have admin privileges", variant: "destructive" });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      await fetchDashboardData();
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    const [usersRes, productsRes, reportsRes] = await Promise.all([
      (supabase as any).from("profiles").select("*"),
      (supabase as any).from("products").select("*"),
      (supabase as any).from("reported_products").select("*, products(title), profiles(full_name)")
    ]);

    const usersData = usersRes.data || [];
    const productsData = productsRes.data || [];
    const reportsData = reportsRes.data || [];

    setUsers(usersData);
    setProducts(productsData);
    setReports(reportsData);

    setStats({
      users: usersData.length,
      products: productsData.length,
      pending: productsData.filter((p: any) => p.approval_status === "pending").length,
      reports: reportsData.filter((r: any) => r.status === "pending").length
    });
  };

  const approveProduct = async (productId: string) => {
    const { error } = await (supabase as any).from("products").update({ approval_status: "approved" }).eq("id", productId);
    if (error) {
      toast({ title: "Error", description: "Failed to approve product", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Product approved" });
      fetchDashboardData();
    }
  };

  const rejectProduct = async (productId: string) => {
    const { error } = await (supabase as any).from("products").update({ approval_status: "rejected" }).eq("id", productId);
    if (error) {
      toast({ title: "Error", description: "Failed to reject product", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Product rejected" });
      fetchDashboardData();
    }
  };

  const resolveReport = async (reportId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await (supabase as any).from("reported_products").update({ 
      status: "resolved", 
      resolved_at: new Date().toISOString(),
      resolved_by: session?.user.id 
    }).eq("id", reportId);
    
    if (error) {
      toast({ title: "Error", description: "Failed to resolve report", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Report resolved" });
      fetchDashboardData();
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.products}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Reports</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.reports}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Approve or reject product listings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.title}</TableCell>
                        <TableCell>₦{Number(product.price).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={product.approval_status === "approved" ? "default" : "secondary"}>
                            {product.approval_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="space-x-2">
                          {product.approval_status === "pending" && (
                            <>
                              <Button size="sm" onClick={() => approveProduct(product.id)}>Approve</Button>
                              <Button size="sm" variant="destructive" onClick={() => rejectProduct(product.id)}>Reject</Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Total Sales</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.full_name || "N/A"}</TableCell>
                        <TableCell>{user.location || "N/A"}</TableCell>
                        <TableCell>{user.total_sales || 0}</TableCell>
                        <TableCell>{user.rating ? `${user.rating}/5.0` : "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reported Products</CardTitle>
                <CardDescription>Review and resolve user reports</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.products?.title}</TableCell>
                        <TableCell>{report.profiles?.full_name}</TableCell>
                        <TableCell>{report.reason}</TableCell>
                        <TableCell>
                          <Badge variant={report.status === "resolved" ? "default" : "secondary"}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {report.status === "pending" && (
                            <Button size="sm" onClick={() => resolveReport(report.id)}>Resolve</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
